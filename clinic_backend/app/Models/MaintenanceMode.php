<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Backs the `maintenance_modes` table created by
 * 2025_10_20_000000_create_maintenance_modes_table.php.
 *
 * Read by App\Http\Middleware\EnforceMaintenanceMode. Note that the table stores
 * the message body as `description_en` / `description_ar`, while the maintenance
 * views expose them to the frontend under the `body_en` / `body_ar` prop names.
 *
 * The table has no `deleted_at` column, so SoftDeletes is intentionally omitted.
 */
class MaintenanceMode extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'title_en',
        'title_ar',
        'description_en',
        'description_ar',
        'target_roles',
        'is_enabled',
        'enabled_at',
        'disabled_at',
    ];

    protected function casts(): array
    {
        return [
            // JSON column; EnforceMaintenanceMode relies on this being an array.
            'target_roles' => 'array',
            'is_enabled' => 'boolean',
            'enabled_at' => 'datetime',
            'disabled_at' => 'datetime',
        ];
    }

    /**
     * Scope for currently enabled maintenance windows.
     */
    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }
}
