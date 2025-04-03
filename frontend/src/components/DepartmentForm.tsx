import React, { useEffect } from "react";
import { Form, Input, Modal, Select, Button } from "antd";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment, updateDepartment } from "../api/departmentApi";
import { Department } from "../../src/types";

interface Props {
  visible: boolean;
  onClose: () => void;
  editingDepartment: Department | null;
  departments: Department[];
}

const DepartmentForm: React.FC<Props> = ({ visible, onClose, editingDepartment, departments }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingDepartment) {
      form.setFieldsValue(editingDepartment);
    } else {
      form.resetFields();
    }
  }, [editingDepartment, form]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<Department>) => {
      const validData = { ...data, name: data.name ?? "" };
      return editingDepartment
        ? updateDepartment(editingDepartment.id, validData)
        : createDepartment(validData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Departamento salvo com sucesso!",
        confirmButtonColor: "#1677ff",
      });
      onClose();
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: error.response?.data?.message || "Erro ao salvar o departamento.",
        confirmButtonColor: "#ff4d4f",
      });
    },
  });

  const handleSubmit = (values: Partial<Department>) => {
    mutation.mutate(values);
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title={editingDepartment ? "Editar Departamento" : "Novo Departamento"}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="Nome" rules={[{ required: true, message: "O nome é obrigatório!" }]}>
          <Input placeholder="Digite o nome do departamento" />
        </Form.Item>


        <Button type="primary" htmlType="submit" loading={mutation.isPending} block>
          {editingDepartment ? "Atualizar" : "Criar"}
        </Button>
      </Form>
    </Modal>
  );
};

export default DepartmentForm;
