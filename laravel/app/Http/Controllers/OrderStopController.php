<?php

namespace App\Http\Controllers;

use App\Models\OrderStop;
use Illuminate\Http\Request;
use App\Helpers\ErrorMessagesHelper;
use Illuminate\Validation\ValidationException;

class OrderStopController extends Controller
{
    //TODO: FUNCTION TO SHOW EVERY STOP IN AN ORDER
    //TODO: FUNCTION TO SHOW A STOP
    public function createOrderStop(Request $request)
    {
        $customErrorMessages = ErrorMessagesHelper::getErrorMessages();

        $incomingFields = $request->validate([
            'planned_arrival_time' => ['nullable', 'date'],
            'order_id' => ['required','exists:orders,id'],
            'place_id' => ['required','exists:places,id'],
            'kid_id' => ['nullable', 'exists:kids,id'],
        ], $customErrorMessages);

        $incomingFields['planned_arrival_time'] = $incomingFields['planned_arrival_time'] ?? null;
        
        try {
            $orderStop = OrderStop::create([
                'planned_arrival_time' => $incomingFields['planned_arrival_time'],
                'order_id' => $incomingFields['order_id'],
                'place_id' => $incomingFields['place_id'],
            ]);

            if (isset($incomingFields['kid_id'])) {
                $orderStop->kids()->attach($incomingFields['kid_id'], [
                    'place_id' => $incomingFields['place_id'],
                    'order_stop_id' => $orderStop->id,
                ]);
            }

            return redirect()->route('orders.index')->with('message', 'Paragem com id ' . $orderStop->id . ' criada com sucesso!');

        } catch (ValidationException $e) {
            dd($e);
            return redirect()->route('orders.create')->withErrors($e->validator)->withInput();

        } catch (\Exception $e) {
            dd($e);
            return redirect()->route('orders.index')->with('error', 'Houve um problema ao criar a paragem. Tente novamente.');
        }
    }

    public function editOrderStop(OrderStop $orderStop, Request $request)
    {
        $customErrorMessages = ErrorMessagesHelper::getErrorMessages();

        $incomingFields = $request->validate([
            'planned_arrival_time' => ['required', 'date'],
        ], $customErrorMessages);

        try {
            $orderStop->update([
                'planned_arrival_time' => $incomingFields['planned_arrival_time'],
            ]);

            return redirect()->route('orders.index')->with('message', 'Dados do da paragem com ' . $orderStop->id . ' atualizados com sucesso!');

        }  catch (\Exception $e) {
            dd($e);
            return redirect()->route('orders.index')->with('error', 'Houve um problema ao editar os dados do pedido com id ' . $order->id . '. Tente novamente.');
        }
    }

    public function deleteOrderStop($id)
    {
        try {
            $orderStop = OrderStop::findOrFail($id);
            $orderStop->delete();

            return redirect()->route('orders.index')->with('message', 'Pedido com id ' . $orderStop->id . 'apagado com sucesso!');

        } catch (\Exception $e) {
            dd($e);
            return redirect()->route('orders.index')->with('error', 'Houve um problema ao apagar o pedido com id ' . $order->id . '. Tente novamente.');
        }
    }
    
    //TODO: NEEDS ROUTE IN WEB
    public function setOrderActualArrivalDate(OrderStop $orderStop, Request $request) 
    {

        $incomingFields = $request->validate([
            'actual_arrival_date' => ['required', 'date']
        ]);

        try {
            $orderStop->update([
                'actual_arrival_date' => $incomingFields['actual_arrival_date'],
            ]);

            return redirect()->route('orders.index')->with('message', 'Data em que chegou à paragem para a paragem com id ' . $orderStop->id . ' definida com sucesso!');

        } catch (\Exception $e) {
            dd($e);
            return redirect()->route('orders.index')->with('error', 'Houve um problema ao definir a data em que chegou à paragem para a paragem com id ' . $orderStop->id);
        }
    }
}