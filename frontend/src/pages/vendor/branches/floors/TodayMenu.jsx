export default function TodayMenu({ branchId }) {
  console.log("HIII this is menu file.");
}

// import { useEffect, useState } from "react";
// import api from "../../api";

// export default function TodayMenu({ branchId }) {
//   const [menus, setMenus] = useState([]);

//   useEffect(() => {
//     if (!branchId) return;

//     api
//       .get(`vendor/branches/${branchId}/weekly-menu/`)
//       .then((res) => setMenus(res.data))
//       .catch((err) => console.error("Menu load error:", err));
//   }, [branchId]);

//   const updateItem = (menuId, itemId, payload) => {
//     setMenus((prev) =>
//       prev.map((menu) =>
//         menu.id === menuId
//           ? {
//               ...menu,
//               daily_items: menu.daily_items.map((item) =>
//                 item.id === itemId ? { ...item, ...payload } : item
//               ),
//             }
//           : menu
//       )
//     );

//     api.patch(`menu/daily-menu-item/${itemId}/`, payload).catch(() => {
//       console.error("Update failed");
//     });
//   };

//   return (
//     <div>
//       {menus.map((menu) => (
//         <div key={menu.id} className="mb-4">
//           <h6 className="fw-bold">{menu.week_day?.toUpperCase()}</h6>

//           {(menu.daily_items || []).map((item) => (
//             <div
//               key={item.id}
//               className="d-flex justify-content-between border p-2 mb-2"
//             >
//               <div>
//                 <div>{item.special_name_override || item.food_name}</div>
//                 <small>
//                   ₹{" "}
//                   {(item.special_price_override_cents ??
//                     item.base_price_cents) / 100}
//                 </small>
//               </div>

//               <div className="d-flex gap-2">
//                 <input
//                   type="number"
//                   value={item.remaining_quantity ?? ""}
//                   placeholder="Qty"
//                   onChange={(e) =>
//                     updateItem(menu.id, item.id, {
//                       remaining_quantity: Number(e.target.value),
//                     })
//                   }
//                 />

//                 <input
//                   type="checkbox"
//                   checked={item.is_available}
//                   onChange={() =>
//                     updateItem(menu.id, item.id, {
//                       is_available: !item.is_available,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }
