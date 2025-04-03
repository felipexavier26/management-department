<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'parent_department_id', 'level'];

    public function children()
    {
        return $this->hasMany(Department::class, 'parent_department_id')->with('children'); // Carrega recursivamente
    }
}
