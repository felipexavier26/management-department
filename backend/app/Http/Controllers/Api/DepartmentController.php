<?php

// app/Http/Controllers/Api/DepartmentController.php
namespace App\Http\Controllers\Api;

use App\Models\Department;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DepartmentController extends Controller
{
    public function index()
    {
        try {
            $departments = Department::whereNull('parent_department_id')->with('children')->get();
            return response()->json($departments);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $department = Department::where('id', $id)->with('children')->firstOrFail();
            return response()->json($department);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'parent_department_id' => 'nullable|exists:departments,id',
            ]);

            $level = 0;
            if (!empty($validated['parent_department_id'])) {
                $parent = Department::find($validated['parent_department_id']);
                if ($parent) {
                    $level = $parent->level + 1;
                }
            }

            $department = Department::create([
                'name' => $validated['name'],
                'parent_department_id' => $validated['parent_department_id'] ?? null,
                'level' => $level,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Departamento criado com sucesso!',
                'data' => $department
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar o departamento.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'parent_department_id' => 'nullable|exists:departments,id',
            ]);

            $department = Department::findOrFail($id);

            // Atualiza o nome e o departamento pai
            $department->name = $validated['name'];
            $department->parent_department_id = $validated['parent_department_id'] ?? null;

            // Atualiza o nível do departamento
            $level = 0;
            if (!empty($validated['parent_department_id'])) {
                $parent = Department::find($validated['parent_department_id']);
                if ($parent) {
                    $level = $parent->level + 1;
                }
            }
            $department->level = $level;

            $department->save();

            return response()->json([
                'success' => true,
                'message' => 'Departamento atualizado com sucesso!',
                'data' => $department
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar o departamento.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $department = Department::findOrFail($id);
    
            // 🔥 Deleta todos os filhos primeiro
            $department->children()->delete();
    
            // 🔥 Agora pode deletar o departamento pai
            $department->delete();
    
            return response()->json([
                'success' => true,
                'message' => 'Departamento e subdepartamentos removidos com sucesso!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao deletar o departamento.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
}
