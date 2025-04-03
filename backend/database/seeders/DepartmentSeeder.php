<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        //Departamentos Primários
        $eletronicos = Department::create(['name' => 'Eletrônicos', 'level' => 0]);
        $moveis = Department::create(['name' => 'Móveis', 'level' => 0]);
        $supermercado = Department::create(['name' => 'Supermercado', 'level' => 0]);
        $moda = Department::create(['name' => 'Moda', 'level' => 0]);
        $esportes = Department::create(['name' => 'Esportes', 'level' => 0]);
        $automotivo = Department::create(['name' => 'Automotivo', 'level' => 0]);

        //Departamentos Secundários
        $celulares = Department::create(['name' => 'Celulares', 'parent_department_id' => $eletronicos->id, 'level' => 1]);
        $computadores = Department::create(['name' => 'Computadores', 'parent_department_id' => $eletronicos->id, 'level' => 1]);

        $sala_estar = Department::create(['name' => 'Sala de Estar', 'parent_department_id' => $moveis->id, 'level' => 1]);
        $escritorio = Department::create(['name' => 'Escritório', 'parent_department_id' => $moveis->id, 'level' => 1]);

        $bebidas = Department::create(['name' => 'Bebidas', 'parent_department_id' => $supermercado->id, 'level' => 1]);
        $frios = Department::create(['name' => 'Frios e Laticínios', 'parent_department_id' => $supermercado->id, 'level' => 1]);

        Department::create(['name' => 'Roupas', 'parent_department_id' => $moda->id, 'level' => 1]);
        Department::create(['name' => 'Calçados', 'parent_department_id' => $moda->id, 'level' => 1]);

        Department::create(['name' => 'Equipamentos', 'parent_department_id' => $esportes->id, 'level' => 1]);
        Department::create(['name' => 'Roupas Esportivas', 'parent_department_id' => $esportes->id, 'level' => 1]);

        Department::create(['name' => 'Peças e Acessórios', 'parent_department_id' => $automotivo->id, 'level' => 1]);
        Department::create(['name' => 'Lubrificantes e Fluidos', 'parent_department_id' => $automotivo->id, 'level' => 1]);

        //Departamentos Terciários
        Department::create(['name' => 'Acessórios para Celulares', 'parent_department_id' => $celulares->id, 'level' => 2]);
        Department::create(['name' => 'Smartphones', 'parent_department_id' => $celulares->id, 'level' => 2]);

        Department::create(['name' => 'Notebooks', 'parent_department_id' => $computadores->id, 'level' => 2]);
        Department::create(['name' => 'Desktops', 'parent_department_id' => $computadores->id, 'level' => 2]);

        Department::create(['name' => 'Sofás', 'parent_department_id' => $sala_estar->id, 'level' => 2]);
        Department::create(['name' => 'Estantes', 'parent_department_id' => $sala_estar->id, 'level' => 2]);

        Department::create(['name' => 'Mesas de Escritório', 'parent_department_id' => $escritorio->id, 'level' => 2]);
        Department::create(['name' => 'Cadeiras de Escritório', 'parent_department_id' => $escritorio->id, 'level' => 2]);

        Department::create(['name' => 'Refrigerantes', 'parent_department_id' => $bebidas->id, 'level' => 2]);
        Department::create(['name' => 'Sucos', 'parent_department_id' => $bebidas->id, 'level' => 2]);

        Department::create(['name' => 'Queijos', 'parent_department_id' => $frios->id, 'level' => 2]);
        Department::create(['name' => 'Iogurtes', 'parent_department_id' => $frios->id, 'level' => 2]);
    }
}
