<?php

namespace Database\Factories;

use App\Models\Kid;
use App\Models\User;
use App\Models\Order;
use App\Models\Place;
use App\Models\Driver;
use App\Models\OrderOccurrence;
use App\Models\Vehicle;
use App\Models\OrderStop;
use App\Models\OrderRoute;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {        
        $trajectory = $this->generateRandomTrajectory();

        $orderTime = rand(2000,86400);
        $beginDate = fake()->dateTimeBetween(now()->subYear(), now()->addYear());
        $endDate = Carbon::parse($beginDate)->addSeconds($orderTime);

        // Future Order
        if ($beginDate > now()) {
            $status = Arr::random(['Por aprovar', 'Cancelado/Não aprovado', 'Aprovado']);

        // Past Order
        } else if (now() > $endDate) {
            $status = Arr::random(['Cancelado/Não aprovado', 'Finalizado', 'Interrompido']);

        // Current Order
        } else {
            $status = 'Em curso';
        }

        // Check if there are any drivers in the database, otherwise create one
        $driver =  Driver::inRandomOrder()->first() ?? Driver::factory()->create();

        // Check if there are any vehicles in the database, otherwise create one
        $vehicle = Vehicle::inRandomOrder()->first() ?? Vehicle::factory()->create();

        // Check if there are any technicians in the database, otherwise create one
        $technician = User::where('user_type', 'Técnico')->inRandomOrder()->first() ?? TechnicianFactory::new()->create();

        // Randomly decide if the order has a defined route
        if (fake()->boolean()) {
            // Check if there are any order routes in the database, otherwise create one
            $route = OrderRoute::inRandomOrder()->first() ?? OrderRouteFactory::new()->create();

        } else {
            $route = null;
        }

        // Randomly decide if the order is approved
        if (fake()->boolean()) {
            // Check if there are any managers in the database, otherwise create one
            $manager = User::where('user_type', 'Gestor')->inRandomOrder()->first() ?? ManagerFactory::new()->create();
            $approved_date = fake()->dateTimeBetween('2024-01-01', '2025-12-31');

        } else {
            $approved_date = null;
            $manager = null;
        }

        return [
            'expected_begin_date' => $beginDate,
            'expected_end_date' => $endDate,
            'expected_time' => $orderTime,
            'distance' => rand(1000,20000),
            'status' => $status,
            'trajectory' => json_encode($trajectory),
            'order_type' => Arr::random(['Transporte de Pessoal','Transporte de Mercadorias','Transporte de Crianças', 'Outros']),

            'vehicle_id' =>  $vehicle,
            'driver_id' => $driver,
            'technician_id' => $technician,
            'order_route_id' => $route ? $route->id : null,

            'approved_date' => $approved_date ? $approved_date : null,
            'manager_id' => $manager ? $manager->id : null,
        ];
    }

    private function generateRandomTrajectory()
    {
        $boundsSouthWestCorner = [32.269181, -17.735033];
        $boundsNorthEastCorner = [33.350247, -15.861279];

        // Generate random start and end points within the bounds
        $startLat = fake()->latitude($boundsSouthWestCorner[0], $boundsNorthEastCorner[0]);
        $startLng = fake()->longitude($boundsSouthWestCorner[1], $boundsNorthEastCorner[1]);

        $endLat = fake()->latitude($boundsSouthWestCorner[0], $boundsNorthEastCorner[0]);
        $endLng = fake()->longitude($boundsSouthWestCorner[1], $boundsNorthEastCorner[1]);

        $points = [];
        $numPoints = rand(2, 6); // Number of points in the trajectory

        for ($i = 0; $i <= $numPoints; $i++) {
            $lat = $startLat + ($endLat - $startLat) * ($i / $numPoints);
            $lng = $startLng + ($endLng - $startLng) * ($i / $numPoints);
            
            // Ensure the generated points are within bounds
            $lat = min(max($lat, $boundsSouthWestCorner[0]), $boundsNorthEastCorner[0]);
            $lng = min(max($lng, $boundsSouthWestCorner[1]), $boundsNorthEastCorner[1]);
            
            $points[] = [
                'lat' => $lat,
                'lng' => $lng,
            ];
    }

    return $points;
    }

    public function configure()
    {
        return $this->afterCreating(function (Order $order) {
            $trajectory = json_decode($order->trajectory, true);
            $totalPoints = count($trajectory);
            $stopAverageTime = (int) ($order->expected_time / $totalPoints);
            $stopAverageDistance = (int) ($order->distance / $totalPoints);

            if (rand(0, 1) === 1) {
                OrderOccurrence::factory()->create([
                    'order_id' => $order->id,
                ]);
            }

            $stopExpectedArrivalDate = Carbon::parse($order->expected_begin_date);
            
            $stopNumber = 0;
            // Create stops for each point
            foreach ($trajectory as $point) {
                $stopNumber++;
                $lat = $point['lat'];
                $lng = $point['lng'];

                $coordinates = new Point($lat, $lng);

                $place = Place::factory()->create([
                    'coordinates' => $coordinates,
                ]);

                // Create the order stop associated with this order
                $orderStop = OrderStop::factory()->create([
                    'order_id' => $order->id,
                    'place_id' => $place->id,
                    'stop_number' => $stopNumber,
                    'time_from_previous_stop' => $stopAverageTime,
                    'distance_from_previous_stop' => $stopAverageDistance,
                    'expected_arrival_date' => $stopExpectedArrivalDate,
                ]);

                $stopExpectedArrivalDate = $stopExpectedArrivalDate->addSeconds($stopAverageTime);

                if (rand(0, 1) === 1) {
                    $place->update([
                        'place_type' => 'Residência',
                    ]);
                    $kid = Kid::factory()->create();
                    $kid->places()->attach($place->id);
                    $kid->orderStops()->attach($orderStop->id, ['place_id' => $place->id]);
                }
            }
        });
    }
}
