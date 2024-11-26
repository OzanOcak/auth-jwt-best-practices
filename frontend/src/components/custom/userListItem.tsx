import { User } from "@/types";
import { CheckIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface UserItemProps {
  user: User;
  handleDeleteUser: (id: string) => void;
  handleUpdateUserRole: (id: string, newRole: string) => void;
}

export const UserItem: React.FC<UserItemProps> = ({
  user,
  handleDeleteUser,
  handleUpdateUserRole,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    handleUpdateUserRole(user.id, selectedRole);
    setIsEditing(false);
  };

  return (
    <li className="flex items-center justify-between p-4 border rounded-lg shadow-md bg-white">
      <div>
        <p className="font-semibold">{user.username}</p>
        {isEditing ? (
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-2 border rounded-md p-1"
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        ) : (
          <p className="text-gray-600">{user.role}</p>
        )}
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveClick}
              className="flex items-center px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              <CheckIcon className="mr-1" /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center px-3 py-1 text-white bg-gray-500 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEditClick}
              className="flex items-center px-3 py-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
            >
              <Pencil2Icon className="mr-1" /> Edit
            </button>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="flex items-center px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              <TrashIcon className="mr-1" /> Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
};
