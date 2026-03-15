"""Orchestrator Agent implementation.

Coordinates the full pipeline: Scout → Verification → Synthesis.
Also schedules the Predictions Tracker on its own cadence.
Designed to be triggered by n8n cron workflow.
"""

from agents.shared.logger import log_action
from agents.scout.agent import crawl_sources, deduplicate
from agents.verification.agent import verify_signal, VerifiedProfile
from agents.synthesis.agent import synthesize_profile
from agents.predictions_tracker.agent import check_resolutions, check_vote_anomalies


def run_pipeline() -> dict:
    """Execute the full agent pipeline.

    Pipeline: Scout → Verification → Synthesis → Editorial Queue
    """
    with log_action("orchestrator", "pipeline_run", "Full pipeline execution") as log:
        # Phase 1: Scout
        signals = crawl_sources()
        unique_signals = deduplicate(signals)

        # Phase 2: Verification
        verified = []
        rejected = []
        for signal in unique_signals:
            result = verify_signal({
                "person_name": signal.person_name,
                "company": signal.company,
                "source_urls": signal.source_urls,
            })
            if isinstance(result, VerifiedProfile):
                verified.append(result)
            else:
                rejected.append(result)

        # Phase 3: Synthesis
        for profile in verified:
            synthesize_profile(profile.person_name)

        # Phase 4: Predictions monitoring
        resolution_flags = check_resolutions()
        anomaly_flags = check_vote_anomalies()

        summary = (
            f"Pipeline complete: {len(signals)} signals, "
            f"{len(unique_signals)} unique, {len(verified)} verified, "
            f"{len(rejected)} rejected, {len(resolution_flags)} resolution flags, "
            f"{len(anomaly_flags)} anomalies"
        )
        log["output_summary"] = summary

        return {
            "signals": len(signals),
            "verified": len(verified),
            "rejected": len(rejected),
            "resolution_flags": len(resolution_flags),
            "anomaly_flags": len(anomaly_flags),
        }


if __name__ == "__main__":
    # Can be run directly or via n8n webhook
    from agents.shared.config import AgentConfig
    config = AgentConfig.from_env()
    print(f"Running pipeline with {config.schedule_hours}h schedule")
    result = run_pipeline()
    print(f"Result: {result}")
