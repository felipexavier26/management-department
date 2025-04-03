import React, { useMemo } from "react";
import { Table, Button } from "antd";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment } from "../api/departmentApi";
import { Department } from "../../src/types";

interface DepartmentWithChildren extends Department {
  children?: DepartmentWithChildren[];
}

interface Props {
  departments: Department[];
  onEdit: (dept: Department) => void;
}

const DepartmentTree: React.FC<Props> = ({ departments, onEdit }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteDepartment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      Swal.fire({
        icon: "success",
        title: "Deletado!",
        text: "O departamento foi removido com sucesso.",
        confirmButtonColor: "#1677ff",
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: error.response?.data?.message || "Erro ao deletar o departamento.",
        confirmButtonColor: "#ff4d4f",
      });
    },
  });

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Se confirmar, todos os subdepartamentos serão deletados. Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, apagar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(id);
      }
    });
  };

  const departmentMap = useMemo(() => {
    const flatList: Department[] = [];

    const flattenTree = (list: Department[]) => {
      list.forEach((dept) => {
        flatList.push(dept);
        if (dept.children && dept.children.length > 0) {
          flattenTree(dept.children);
        }
      });
    };

    flattenTree(departments);

    return new Map(flatList.map((dept) => [dept.id, dept]));
  }, [departments]);

  const buildDepartmentTree = (
    departments: Department[],
    parentId: number | null = null
  ): DepartmentWithChildren[] => {
    return departments
      .filter((dept) => dept.parent_department_id === parentId)
      .map((dept) => {
        const children = buildDepartmentTree(departments, dept.id);
        return children.length > 0 ? { ...dept, children } : dept;
      });
  };

  const departmentTree = buildDepartmentTree(departments);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      align: "center" as "center",
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Departamento Pai",
      dataIndex: "parent_department_id",
      key: "parent_department_id",
      render: (parentId: number | null) => {
        if (!parentId) {
          return "N/D";
        }
        const parent = departmentMap.get(parentId);
        return parent ? parent.name : "N/D";
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: any, record: Department) => 
        !record.parent_department_id ? ( 
          <>
            <Button type="link" onClick={() => onEdit(record)}>Editar</Button>
            <Button type="link" danger onClick={() => handleDelete(record.id)}>Apagar</Button>
          </>
        ) : null,
    },
  ];

  return (
    <div
      style={{
        width: "1250px",
        margin: "0 auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Table
        size="middle"
        columns={columns}
        dataSource={departmentTree}
        rowKey="id"
        expandable={{
          defaultExpandAllRows: false,
          childrenColumnName: "children",
        }}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default DepartmentTree;
