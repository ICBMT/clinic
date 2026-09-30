<?php

namespace App\Auth;

use Illuminate\Auth\Passwords\DatabaseTokenRepository as BaseDatabaseTokenRepository;
use Illuminate\Support\Carbon;

class CustomDatabaseTokenRepository extends BaseDatabaseTokenRepository
{
    /**
     * Build the record payload for the table.
     *
     * @param  string  $email
     * @param  string  $token
     * @return array
     */
    protected function getPayload($email, #[\SensitiveParameter] $token)
    {
        // password_reset_tokens is shared with the mobile OTP flow
        // (App\Models\PasswordResetToken) and uses a string primary key that
        // the stock repository never fills. Same id format as createForEmail(),
        // and expires_at mirrors the broker's own expiry ($this->expires is in
        // seconds) so the model's valid()/cleanupExpired() see both kinds of row.
        $now = new Carbon;

        return [
            'id' => uniqid('email_', true),
            'email' => $email,
            'token' => $this->hasher->make($token),
            'created_at' => $now,
            'expires_at' => $now->copy()->addSeconds($this->expires),
        ];
    }
}

