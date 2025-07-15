<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Habit;

class HabitTestSeeder extends Seeder
{
    public function run(): void
    {
        $habits = [
            [
                'title' => 'Duolingo',
                'category_ids' => [5],
                'frequency' => 'daily',
                'start_date' => now()->toDateString(),
            ],
            [
                'title' => 'Home Workout',
                'category_ids' => [1, 3],
                'frequency' => 'custom',
                'repeat_interval' => 3,
                'start_date' => '2025-06-01',
            ],
            [
                'title' => 'Pay Bills',
                'category_ids' => [4],
                'frequency' => 'monthly',
                'start_date' => '2025-01-25',
            ],
            [
                'title' => 'Yoga',
                'category_ids' => [2, 3],
                'frequency' => 'weekly',
                'custom_days' => ['Monday', 'Tuesday', 'Friday', 'Sunday'],
                'start_date' => '2025-05-01',
            ],
            [
                'title' => 'Drink enough water',
                'category_ids' => [3],
                'frequency' => 'daily',
                'start_date' => '2025-05-15',
            ],
            [
                'title' => 'Make Bed',
                'category_ids' => [2],
                'frequency' => 'daily',
                'start_date' => '2025-03-27',
            ],
            [
                'title' => 'Screentime under 3h',
                'category_ids' => [2],
                'frequency' => 'daily',
                'start_date' => '2025-01-01',
            ],
            [
                'title' => '5 fruits or veggies',
                'category_ids' => [3, 6],
                'frequency' => 'daily',
                'start_date' => '2025-01-01',
            ],
            [
                'title' => '2h Programming',
                'category_ids' => [5],
                'frequency' => 'weekly',
                'custom_days' => ['Saturday', 'Sunday'],
                'start_date' => '2025-04-30',
            ],
        ];

        foreach ($habits as $habitData) {
            $habit = Habit::create([
                'title' => $habitData['title'],
                'user_id' => 1, // Testuser ID, adjust as needed
                'frequency' => $habitData['frequency'],
                'start_date' => $habitData['start_date'],
                'end_date' => $habitData['end_date'] ?? null,
                'repeat_interval' => $habitData['repeat_interval'] ?? 1,
                'custom_days' => $habitData['custom_days'] ?? null,
            ]);

            $habit->categories()->attach($habitData['category_ids']);
        }
    }
}
