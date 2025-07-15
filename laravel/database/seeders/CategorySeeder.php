<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['title' => 'Fitness'],
            ['title' => 'Self-care'],
            ['title' => 'Health'],
            ['title' => 'Finance'],
            ['title' => 'Learning'],
            ['title' => 'Nutrition'],
        ];

        foreach ($categories as $data) {
            Category::create([
                'title' => $data['title'],
                'user_id' => 1, // or dynamic if multiple users are tested
            ]);
        }
    }
}
