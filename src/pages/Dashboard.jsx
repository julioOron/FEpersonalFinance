import { useEffect, useState } from "react";
import COLUMN_CONFIG from "../config/columnConfig"; 
import { buildPayloadForModule } from "../utils/payloadBuilder";
import { renderFormField } from "../utils/formFieldRenderer.jsx";
import { formatDate } from "../utils/dateUtils";
import { formatCurrency } from "../utils/formatUtils";



const MODULES = [
  { name: "Bank Accounts", key: "bank-accounts" },
  { name: "Balances", key: "balances" },
  { name: "Incomes", key: "incomes" },
  { name: "Outgoings", key: "outgoins" },
  { name: "Transfers", key: "transfers" },
];

export default function Dashboard({ token, onLogout }) {
  const [current, setCurrent] = useState(MODULES[0].key);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);  
  const [options, setOptions] = useState({});

const fetchDropdownOptions = async () => {
  const res = await fetch(`http://localhost/bank-accounts`, { headers });
  const data = await res.json();
  setOptions((prev) => ({
    ...prev,
    "bank-accounts": data,
  }));
};

useEffect(() => {
  fetchDropdownOptions(); 
}, []);


  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchData = async () => {
    const res = await fetch(`http://localhost/${current}`, { headers });
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchData();
  }, [current]);

  const handleCreate = async () => {
    const userId = sessionStorage.getItem("userId"); 
    const sessionData = { userId: userId };
    const payload = buildPayloadForModule(current, formData, sessionData);
    await fetch(`http://localhost/${current}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    setFormData({});
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost/${current}/${id}`, {
      method: "DELETE",
      headers,
    });
    fetchData();
  };

  const initFormFields = () => {
    const config = COLUMN_CONFIG[current];
        const newForm = {};

        Object.keys(config).forEach((key) => {
            if (config[key].showInForm) {
                newForm[key] = "";
            }
        });

        setFormData(newForm);
  };

    const currencyKeys = Object.keys(COLUMN_CONFIG[current] || {}).filter(
        (key) => COLUMN_CONFIG[current][key]?.type === "currency"
    );

    const currencyTotals = {};
    currencyKeys.forEach((key) => {
        currencyTotals[key] = items.reduce(
            (sum, item) => sum + parseFloat(item[key] || 0),
            0
        );
    });

    const getOrderedTableFields = (moduleKey) => {
        const config = COLUMN_CONFIG[moduleKey] || {};
        return Object.keys(config)
          .filter((key) => config[key].showInTable);
      };


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button onClick={onLogout} className="hover:underline">
          Logout
        </button>
      </header>
      <div className="flex">
        <aside className="w-1/5 bg-white shadow-md h-screen p-4 space-y-2">
          {MODULES.map((m) => (
            <button
              key={m.key}
              className={`block w-full text-left p-2 rounded hover:bg-blue-100 ${
                current === m.key ? "bg-blue-200" : ""
              }`}
              onClick={() => setCurrent(m.key)}
            >
              {m.name}
            </button>
          ))}
        </aside>
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {MODULES.find((m) => m.key === current)?.name}
        </h2>
            <button
              onClick={() => {
                initFormFields();
                setShowModal(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
          <table className="table-auto w-full border-collapse">
          <thead>
  <tr>
    {getOrderedTableFields(current).map((key) => (
      <th key={key} className="border p-2 bg-gray-100 font-bold">
        {COLUMN_CONFIG[current][key]?.label || key}
      </th>
    ))}
    <th className="border p-2">Action</th>
  </tr>
</thead>
<tbody>
  {items.map((item, index) => (
    <tr key={`row-${index}`}>
      {getOrderedTableFields(current).map((key) => (
        
          <td key={`data-${key}`} className="border p-2">
            {COLUMN_CONFIG[current]?.[key]?.type === "date"
                ? formatDate(item[key])
                : COLUMN_CONFIG[current]?.[key]?.type === "currency"
                    ? formatCurrency(item[key])
                    : item[key]}
        </td>
      ))}
      <td className="border p-2">
        <button
          onClick={() => handleDelete(item[Object.keys(item)[0]])}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
            {currencyKeys.length > 0 && items?.length 
            > 0 && (
                <tfoot>
                              <tr>
                                  {Object.keys(items[0])
                                      .filter((key) => COLUMN_CONFIG[current]?.[key]?.showInTable)
                                      .map((key) => (
                                          <td key={`footer-${key}`} className="border p-2 font-semibold bg-gray-200">
                                              {currencyKeys.includes(key)
                                                  ? formatCurrency(currencyTotals[key])
                                                  : ""}
                                          </td>
                                      ))}
                                  <td className="border p-2 font-semibold bg-gray-200">Total</td>
                              </tr>
                </tfoot>
            )}

          </table>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/2 p-6">
          <h3 className="text-lg font-semibold mb-4">
            Add to {MODULES.find((m) => m.key === current)?.name}
          </h3>

            <div className="grid grid-cols-2 gap-4">

                          {Object.keys(formData)
                              .filter((key) => COLUMN_CONFIG[current]?.[key]?.showInForm)
                              .map((key) =>
                                  renderFormField({
                                      key,
                                      config: COLUMN_CONFIG[current][key],
                                      value: formData[key],
                                      onChange: (field, val) => setFormData({ ...formData, [field]: val }),
                                      options,
                                  })
                              )}

            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
