<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create user
        User::create([
            'username' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('Test_1234'), 
        ]);

        // add other seeders
        $this->call([
            CategorySeeder::class,
            HabitTestSeeder::class,
        ]);
    }
}
