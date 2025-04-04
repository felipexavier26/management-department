import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Select, Button } from "antd";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment, updateDepartment } from "../api/departmentApi";
import { Department } from "../../src/types";

interface Props {
  visible: boolean;
  onClose: () => void;
  editingDepartment: Department | null;
  parentDepartment: Department | null;
  departments: Department[];
  departmentType: string;
}

const DepartmentForm: React.FC<Props> = ({ visible, onClose, editingDepartment, parentDepartment, departments, departmentType }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [secondaryDept, setSecondaryDept] = useState<Department | null>(null);

  useEffect(() => {
    if (editingDepartment) {
      form.setFieldsValue({
        name: editingDepartment.name,
        parent_department_id: editingDepartment.parent_department_id || undefined,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ parent_department_id: undefined }); 
    }
  }, [editingDepartment, parentDepartment, form]);
  

  const handleParentChange = (value: string) => {
    const selectedParent = departments.find(dept => dept.id === Number(value));
    setSecondaryDept(selectedParent || null);
    form.setFieldsValue({ secondary_department_id: undefined });
  };

  const mutation = useMutation({
    mutationFn: async (data: Partial<Department & { secondary_department_id?: number }>) => {
      const validData = {
        name: data.name ?? "",
        parent_department_id: data.parent_department_id || undefined,
        secondary_department_id: data.secondary_department_id || undefined,
      };

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

  const handleSubmit = (values: Partial<Department & { secondary_department_id?: number }>) => {
    mutation.mutate(values);
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title={editingDepartment ? "Editar Departamento" : "Novo Departamento"}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="Nome" rules={[{ required: true, message: "O nome é obrigatório!" }]}>
          <Input placeholder="Digite o nome do departamento" />
        </Form.Item>

        {departmentType !== "primary" && parentDepartment && (
          <Form.Item
          name="parent_department_id"
          label="Departamento Pai"
          rules={[{ required: true, message: "O departamento pai é obrigatório!" }]}
          initialValue={undefined} 
        >
          <Select
            placeholder="Selecione um departamento"
            allowClear
            onChange={handleParentChange}
            value={form.getFieldValue("parent_department_id") || undefined}
          >
            <Select.Option value={undefined} disabled>
              Selecione um departamento
            </Select.Option>
            {departments
              .filter(dept => dept.id !== editingDepartment?.id)
              .map(dept => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
            {editingDepartment ? "Salvar Alterações" : "Criar Departamento"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepartmentForm;
