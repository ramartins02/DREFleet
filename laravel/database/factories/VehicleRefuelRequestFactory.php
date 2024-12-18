<?php

namespace Database\Factories;

use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VehicleRefuelRequest>
 */
class VehicleRefuelRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $requestNumber = rand(0, 15);

        if ($requestNumber <= 6) {
            $requestType = 'Normal';
        } else if ($requestNumber <= 10) {
            $requestType = 'Especial';
        } else {
            $requestType = 'Excepcional';
        }

        $quantity = fake()->randomFloat(3, 5, 50); // Random volume, 3 decimals
        $costPerUnit = fake()->randomFloat(3, 0.5, 2.0); // Random cost per unit, e.g., between 0.5 and 3.0
        $totalCost = $quantity * $costPerUnit; // Calculates total cost based on quantity and cost per uni

        // Vehicle id needs to be passed explicitily when using this factory
        return [
            'date' => fake()->dateTimeBetween(now()->subYear(), now()),
            'quantity' =>  $quantity,
            'cost_per_unit' => $costPerUnit,
            'total_cost' => $totalCost,
            'kilometrage' => rand(10000,200000),
            'fuel_type' => Arr::random(['Gasóleo','Gasolina 95','Gasolina 98','Elétrico']),
            'request_type' => $requestType,
            'monthly_request_number' => $requestNumber,
            //'vehicle_id' => Vehicle::factory(),
        ];
    }
}
