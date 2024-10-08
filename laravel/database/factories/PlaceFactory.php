<?php

namespace Database\Factories;

use App\Models\Kid;
use Illuminate\Support\Arr;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Place>
 */
class PlaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $latitude = rand(32269181, 33350247) / 1000000; // Dividing by 1,000,000 to get the decimal
        $longitude = rand(-17735033, -15861279) / 1000000; // Dividing by 1,000,000 to get the decimal

        $firstPart = ['Casa', 'Restaurante', 'Bar', 'Café'];
        $secondPart = ['do Avô', 'da Avó', 'do Pai', 'da Mãe', 'do Primo', 'da Tia', 'do Tio'];

        return [
            'address' => fake()->address(),
            'known_as' => ''.Arr::random($firstPart) . ' ' . Arr::random($secondPart),
            'coordinates' => new Point($latitude, $longitude),
            'place_type' => Arr::random(['Residência', 'Residência', 'Residência', 'Residência','Escola', 'Outros']),
        ];
    }
}
