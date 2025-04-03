import React, { useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { getDepartments } from "../api/departmentApi";
import DepartmentForm from "../components/DepartmentForm";
import DepartmentTree from "../components/DepartmentTree";
import { Department } from "../../src/types";

const DepartmentPage = () => {
  const { data: departments = [], isLoading, isError } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar departamentos",
        text: "Ocorreu um problema ao buscar os departamentos. Tente novamente mais tarde.",
        confirmButtonColor: "#d33",
      });
    }
  }, [isError]);

  return (
    <div style={{ marginTop: 30, marginLeft: "auto", marginRight: "auto", width: "1300px", textAlign: "center" }}>

      {!isLoading && (
        <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginBottom: 16 }}>
          Novo Departamento
        </Button>
      )}

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <Spin size="large" tip="Carregando departamentos..." />
        </div>
      ) : (
        <DepartmentTree departments={departments} onEdit={setEditingDepartment} />
      )}

      <DepartmentForm
        visible={modalVisible || !!editingDepartment}
        onClose={() => {
          setModalVisible(false);
          setEditingDepartment(null);
        }}
        editingDepartment={editingDepartment}
        departments={departments}
      />
    </div>
  );
};

export default DepartmentPage;
