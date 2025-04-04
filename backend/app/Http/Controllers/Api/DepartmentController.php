<?php

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
            $request->merge([
                'parent_department_id' => $request->input('parent_department_id', $request->input('parentId'))
            ]);
    
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'parent_department_id' => 'nullable|exists:departments,id',
                'id' => 'nullable|exists:departments,id',
            ]);
    
            $department = null;
    
            if (!empty($validated['id'])) {
                $department = Department::find($validated['id']);
                if (!$department) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Departamento não encontrado para atualização.'
                    ], 404);
                }
            }
    
            $level = 0;
            if (!empty($validated['parent_department_id'])) {
                $parent = Department::find($validated['parent_department_id']);
                if ($parent) {
                    if ($parent->level >= 3) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Não é possível criar um departamento além do nível 3.'
                        ], 400);
                    }
                    $level = $parent->level + 1;
                }
            }
    
            if ($department) {
                $department->update([
                    'name' => $validated['name'],
                    'parent_department_id' => $validated['parent_department_id'] ?? null,
                    'level' => $level,
                ]);
    
                $message = 'Departamento atualizado com sucesso!';
            } else {
                $department = Department::create([
                    'name' => $validated['name'],
                    'parent_department_id' => $validated['parent_department_id'] ?? null,
                    'level' => $level,
                ]);
    
                $message = 'Departamento criado com sucesso!';
            }
    
            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $department
            ], $department->wasRecentlyCreated ? 201 : 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao salvar o departamento.',
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
    
            $department->name = $validated['name'];
    
            if (array_key_exists('parent_department_id', $validated)) {
                $department->parent_department_id = $validated['parent_department_id'];
            }
    
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

            $department->children()->delete();

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
