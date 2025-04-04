import React, { useMemo } from "react";
import { Table, Button, Modal, Input, Form } from "antd";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment, createDepartment } from "../api/departmentApi";
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

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [newDepartmentName, setNewDepartmentName] = React.useState("");
  const [selectedParentId, setSelectedParentId] = React.useState<number | null>(null);

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

  const createDepartmentMutation = useMutation({
    mutationFn: async (newDept: { name: string; parentId: number | null }) => {
      await createDepartment(newDept);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      Swal.fire({
        icon: "success",
        title: "Adicionado!",
        text: "O departamento foi adicionado com sucesso.",
        confirmButtonColor: "#1677ff",
      });
      setIsModalVisible(false);
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: error.response?.data?.message || "Erro ao adicionar o departamento.",
        confirmButtonColor: "#ff4d4f",
      });
    },
  });

  const handleDelete = (id: number) => {
    console.log("ID do departamento a ser apagado:", id);
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

  const handleAddDepartment = () => {
    if (newDepartmentName.trim() !== "") {
      createDepartmentMutation.mutate({
        name: newDepartmentName,
        parentId: selectedParentId,
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Aviso",
        text: "O nome do departamento não pode ser vazio.",
        confirmButtonColor: "#ff4d4f",
      });
    }
  };

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

  const departmentMap = useMemo(() => {
    const map = new Map<number, Department>();
    departments.forEach((dept) => map.set(dept.id, dept));
    return map;
  }, [departments]);

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
      title: "Departamento",
      dataIndex: "parent_department_id",
      key: "parent_department_id",
      render: (parentId: number | null, record: Department) => {
        console.log("🔹 Level Atual:", record.level);
        console.log("🔹 Buscando parentId:", parentId);
    
        if (!parentId) return "N/D"; 
    
        const parent = departmentMap.get(parentId);
        console.log("🔹 Departamento Pai:", parent);
    
        if (!parent) return "N/D"; 
    
        if (record.level === 2) {
          const secondaryDepartment = parent.parent_department_id
            ? departmentMap.get(parent.parent_department_id)
            : null;
    
          return secondaryDepartment ? secondaryDepartment.name : "N/D";
        }
    
        return parent.name; 
      },
    },     


    {
      title: "Ações",
      key: "actions",
      render: (_: any, record: Department) => {
        console.log(`🔹 Registro Atual:`, record);
    
        const isSecondary = record.level === 1; 
    
        return (
          <>
            <Button type="link" onClick={() => onEdit(record)}>
              Editar
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record.id)}>
              Apagar
            </Button>
    
            {isSecondary && (
              <Button
                type="link"
                onClick={() => {
                  setSelectedParentId(record.id);
                  setIsModalVisible(true);
                }}
              >
                Adicionar
              </Button>
            )}
          </>
        );
      },
    }
    

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

      <Modal
        title="Adicionar Subdepartamento"
        visible={isModalVisible}
        onOk={handleAddDepartment}
        onCancel={() => setIsModalVisible(false)}
        okText="Adicionar"
        cancelText="Cancelar"
      >
        <Form layout="vertical">
          <Form.Item label="Nome do Departamento" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
            <Input
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="Digite o nome do departamento"
            />
          </Form.Item>
        </Form>

      </Modal>
    </div>
  );
};

export default DepartmentTree;