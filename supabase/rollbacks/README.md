# Manual rollback notes

These files are intentionally outside `supabase/migrations` and are never run
automatically. Review the target database and take a backup before using them.

For this release, application code can be rolled back without reversing the
database changes: archived profiles remain available in Supabase, and the new
columns and email table are forward-compatible with the previous application.

If the editorial data itself must be reversed, run the matching `.down.sql`
files in reverse migration order. The Schwarz rollback deletes his new profile,
sources, publication, and tag relationship. The context-audit rollback restores
the archived and reclassified profiles. The email-subscriptions table should be
retained once it contains addresses; dropping it would destroy subscriber data.

The dead City University source removed by migration `20260913000001` is not
restored because its published URL returns 404 and the same role and tenure are
supported by Schwarz's own academic website.
