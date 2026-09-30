<?php

namespace App\Auth;

use Illuminate\Auth\Passwords\PasswordBrokerManager as BasePasswordBrokerManager;
use Illuminate\Auth\Passwords\TokenRepositoryInterface;
use Illuminate\Support\Str;

class CustomPasswordBrokerManager extends BasePasswordBrokerManager
{
    /**
     * Create a token repository instance based on the given configuration.
     *
     * @param  array  $config
     * @return \Illuminate\Auth\Passwords\TokenRepositoryInterface
     */
    protected function createTokenRepository(array $config)
    {
        $key = $this->app['config']['app.key'];

        if (Str::startsWith($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }

        // Mirrors the parent implementation: the cache driver has no schema to
        // satisfy, so only the database repository is swapped for our own.
        if (isset($config['driver']) && $config['driver'] === 'cache') {
            return parent::createTokenRepository($config);
        }

        // The repository expects `expires` in SECONDS; config `expire` is in
        // minutes (same conversion the parent applies).
        return new CustomDatabaseTokenRepository(
            $this->app['db']->connection($config['connection'] ?? null),
            $this->app['hash'],
            $config['table'],
            $key,
            ($config['expire'] ?? 60) * 60,
            $config['throttle'] ?? 0
        );
    }
}

