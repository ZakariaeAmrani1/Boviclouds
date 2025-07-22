import React from "react";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  exploitation: string;
  status: "Actif" | "Inactif";
  avatar?: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (userId: number) => void;
  onView: (userId: number) => void;
  onDelete: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg border border-boviclouds-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-boviclouds-gray-50 border-b border-boviclouds-gray-200">
            <tr>
              <th className="text-left py-3 px-6 table-header text-boviclouds-gray-700">
                Nom complet
              </th>
              <th className="text-left py-3 px-6 table-header text-boviclouds-gray-700">
                Email
              </th>
              <th className="text-left py-3 px-6 table-header text-boviclouds-gray-700">
                Rôle
              </th>
              <th className="text-left py-3 px-6 table-header text-boviclouds-gray-700">
                Exploitation
              </th>
              <th className="text-left py-3 px-6 table-header text-boviclouds-gray-700">
                Statut
              </th>
              <th className="text-left py-3 px-6 table-header text-boviclouds-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-boviclouds-gray-100 bg-white hover:bg-boviclouds-gray-50/50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-boviclouds-gray-200 flex items-center justify-center">
                      <span className="text-boviclouds-gray-600 table-cell">
                        {user.fullName.charAt(0)}
                      </span>
                    </div>
                    <span className="table-cell font-medium text-boviclouds-gray-900">
                      {user.fullName}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="table-cell text-boviclouds-gray-700">
                    {user.email}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="table-cell text-boviclouds-gray-700">
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="table-cell text-boviclouds-gray-700">
                    {user.exploitation}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full badge-text ${
                      user.status === "Actif"
                        ? "bg-boviclouds-green-light text-boviclouds-green-dark"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(user.id)}
                      className="p-2 text-boviclouds-primary hover:bg-boviclouds-green-light rounded-md transition-colors"
                      title="Modifier"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onView(user.id)}
                      className="p-2 text-boviclouds-gray-500 hover:bg-boviclouds-gray-100 rounded-md transition-colors"
                      title="Voir"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Supprimer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
