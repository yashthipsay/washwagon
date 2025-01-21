"use client";

import { useState } from "react";
import axios from "axios";

export default function LaundrySelection() {
  const [laundryType, setLaundryType] = useState("");
  const [customerId] = useState("customer-id"); // Set this dynamically based on user

  const handleSelectionChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLaundryType = event.target.value;
    setLaundryType(selectedLaundryType);

    // Send the selected laundry type to the backend
    try {
      const response = await axios.put("http://localhost:5001/api/orderDetails",
      {
        customerId, // The customer ID
        selectedOption: selectedLaundryType, // The selected laundry option
      });

      if (response.data.success) {
        console.log("Selection updated successfully:", response.data.order);
      } else {
        console.error("Failed to update selection:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating selection:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <label htmlFor="laundryType" className="text-lg font-semibold">
        Select Laundry Type:
      </label>
      <select
        id="laundryType"
        value={laundryType}
        onChange={handleSelectionChange}
        className="p-2 border rounded"
      >
        <option value="">--Please choose an option--</option>
        <option value="wash">Wash</option>
        <option value="dry-clean">Dry Clean</option>
        <option value="iron">Iron</option>
        <option value="fold">Fold</option>
      </select>
      <p className="mt-2 text-sm text-gray-700">
        {laundryType ? `You selected: ${laundryType}` : "No selection made yet."}
      </p>
    </div>
  );
}
