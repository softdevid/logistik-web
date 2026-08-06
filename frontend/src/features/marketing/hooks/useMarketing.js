import { useMemo, useState } from "react";
import { CUSTOMER_CONFIG } from "../constants/customer";
import { CONSIGNEE_CONFIG } from "../constants/consignee";
import { getLastId } from "../utils/getLastId";
import { makeForm } from "../utils/makeForm";

export default function useMarketing() {
  const [activeTab, setActiveTab] = useState("customer");
  const [rowsByTab, setRowsByTab] = useState(() => ({
    customer: [...CUSTOMER_CONFIG.seed],
    consignee: [...CONSIGNEE_CONFIG.seed],
  }));
  const [searchByTab, setSearchByTab] = useState({
    customer: "",
    consignee: "",
  });
  const [modalState, setModalState] = useState(null);
  const [toolsAction, setToolsAction] = useState(null);

  const config =
  activeTab === "customer"
    ? CUSTOMER_CONFIG
    : CONSIGNEE_CONFIG;
  const rows = rowsByTab[activeTab];
  const search = searchByTab[activeTab] || "";
  const lastId = useMemo(() => getLastId(rows), [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((row) =>
      config.columns.some((column) => {
        if (column.key === "status")
          return String(row.status || "")
            .toLowerCase()
            .includes(q);
        if (column.key === "id") return String(row.id || "").includes(q);
        return String(row[column.key] || "")
          .toLowerCase()
          .includes(q);
      }),
    );
  }, [config.columns, rows, search]);

  function updateRows(updater) {
    setRowsByTab((prev) => ({
      ...prev,
      [activeTab]:
        typeof updater === "function" ? updater(prev[activeTab]) : updater,
    }));
  }

  function openCreate() {
    setModalState({ type: "create", row: null, form: makeForm(config) });
  }

  function openEdit(row) {
    setModalState({ type: "edit", row, form: makeForm(config, row) });
  }

  function openCustomerAction(type, row) {
    if (type === "pricing") {
      setModalState({
        type,
        row,
        form: {
          pricePerKoli: row.pricePerKoli || "",
        },
      });
      return;
    }

    if (type === "trucking") {
      setModalState({
        type,
        row,
        form: {
          trucking: row.trucking || "",
        },
      });
    }
  }

  function handleRowAction(action, row) {
    switch (action.key) {
      case "edit":
        openEdit(row);
        break;
      case "pricing":
      case "trucking":
        openCustomerAction(action.key, row);
        break;
      case "delete":
        if (window.confirm(`Yakin ingin menghapus ${row.name}?`)) {
          updateRows((current) => current.filter((item) => item.id !== row.id));
        }
        break;
      default:
        break;
    }
  }

  function handleToolsSelect(action) {
    setToolsAction(action.label);
  }

  function handleSave() {
    if (!modalState) return;

    if (modalState.type === "create") {
      const nextId = lastId + 1;
      const nextRow = { id: nextId, ...modalState.form };
      updateRows((current) => [nextRow, ...current]);
      setModalState(null);
      return;
    }

    if (modalState.type === "edit") {
      updateRows((current) =>
        current.map((item) =>
          item.id === modalState.row.id
            ? { ...item, ...modalState.form }
            : item,
        ),
      );
      setModalState(null);
      return;
    }

    if (modalState.type === "pricing") {
      updateRows((current) =>
        current.map((item) =>
          item.id === modalState.row.id
            ? { ...item, pricePerKoli: modalState.form.pricePerKoli }
            : item,
        ),
      );
      setModalState(null);
      return;
    }

    if (modalState.type === "trucking") {
      updateRows((current) =>
        current.map((item) =>
          item.id === modalState.row.id
            ? { ...item, trucking: modalState.form.trucking }
            : item,
        ),
      );
      setModalState(null);
    }
  }

  const modalFields =
    modalState?.type === "pricing"
      ? [
          {
            key: "pricePerKoli",
            label: "Harga / Koli",
            required: true,
            className: "sm:col-span-2",
          },
        ]
      : modalState?.type === "trucking"
        ? [
            {
              key: "trucking",
              label: "Trucking",
              required: true,
              className: "sm:col-span-2",
            },
          ]
        : config.fields.map((field) => ({
            ...field,
            type: field.type || "text",
            className: field.type === "select" ? "" : "",
          }));

  const toolsItems = config.tools;

  return {
    tab: {
      activeTab,
      setActiveTab,
      search,
      searchByTab,
      setSearchByTab,
      config,
    },
    table: {
      rowsByTab,
      rows,
      filteredRows,
      lastId,
      updateRows,
      handleRowAction,
    },
    modal: {
      modalState,
      setModalState,
      modalFields,
      openCreate,
      openEdit,
      openCustomerAction,
      handleSave,
    },
    tools: {
      toolsAction,
      setToolsAction,
      toolsItems,
      handleToolsSelect,
    },
  };
}
