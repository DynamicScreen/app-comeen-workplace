<?php

namespace ComeenPlay\ComeenWorkplace\RoomBooking\Helper;
use Illuminate\Support\Arr;

class CheckError
{

    private $elements;
    private $error;

    public function __construct(array $elements)
    {
        $this->elements = $elements;
        $this->error = $this->check();
    }

    /**
     * @return mixed
     */
    public function hasError()
    {
        return $this->error !== null;
    }

    /**
     * @return mixed
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * Return error of an element where something wrong happened.
     * $elements must be filled as array, with the appropriate order to be efficient.
     * First element must have higher priority of error or could be also be the parent of the other element etc, like binary tree
     *
     * @return array|null
     */
    private function check()
    {
        $error = null;
        collect($this->elements)->each(function ($element) use (&$error) {
            if (Arr::get($element, 'error', null) && !$error) {
                $error = [
                    "error" => true,
                    "type" => Arr::get($element, 'error', null),
                    "code" => Arr::get($element, 'code', null),
                ];
                return true;
            }
        });

        return $error;
    }

}
