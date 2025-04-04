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
  const [parentDepartment, setParentDepartment] = useState<Department | null>(null);
  const [departmentType, setDepartmentType] = useState<string>("");

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

  const openModal = (parentDepartment: Department | null, departmentType: string) => {
    setEditingDepartment(null);
    setParentDepartment(parentDepartment);
    setModalVisible(true);
    setDepartmentType(departmentType);
  };

  return (
    <div style={{ marginTop: 30, marginLeft: "auto", marginRight: "auto", width: "1300px", textAlign: "center" }}>
      {!isLoading && (
        <>
          <Button
            type="primary"
            onClick={() => openModal(null, "primary")}
            style={{ marginRight: 8 }}
          >
            Novo Departamento
          </Button>

          {departments.length > 0 && (
            <Button
              type="dashed"
              onClick={() => openModal(departments[0], "secondary")}
              style={{ marginRight: 8 }}
            >
              Criar Departamento Secundário
            </Button>
          )}
        </>
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
          setParentDepartment(null);
          setDepartmentType("");
        }}
        editingDepartment={editingDepartment}
        parentDepartment={parentDepartment}
        departments={departments}
        departmentType={departmentType}
      />
    </div>
  );
};

export default DepartmentPage;
