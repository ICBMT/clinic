<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('broadcasts', function (Blueprint $table) {
            if (!Schema::hasColumn('broadcasts', 'sent_at')) {
                $table->timestamp('sent_at')->nullable()->after('scheduled_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * Intentionally a no-op: the `sent_at` column (and its
     * `broadcasts_sent_at_index` index) is owned by
     * 2025_10_13_123003_create_broadcasts_table.php, which creates it
     * together with the table. This migration only added the column on
     * databases that predated it, so rolling back must not drop a column
     * it does not own — SQLite refuses to rebuild the table while the
     * index still references the column ("error in index
     * broadcasts_sent_at_index after drop column").
     *
     * The migration file itself must stay in place: it is already recorded
     * in the production `migrations` table.
     */
    public function down(): void
    {
        // Nothing to reverse — see docblock above.
    }
};
