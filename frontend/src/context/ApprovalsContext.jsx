import { createContext, useContext, useState } from "react";
import { approvals as seed } from "@/data/mockApprovals";

const ApprovalsContext = createContext(null);

const today = () => new Date().toISOString().slice(0, 10);

export const ApprovalsProvider = ({ children }) => {
  const [approvals, setApprovals] = useState(seed);

  const act = (id, decision, actingRole, comment) => {
    const statusMap = { approve: "Approved", return: "Returned", reject: "Rejected" };
    const actionMap = { approve: "Approved", return: "Returned", reject: "Rejected" };
    setApprovals((list) =>
      list.map((r) => {
        if (r.id !== id) return r;
        const comments = comment
          ? [...r.comments, { by: actingRole, role: actingRole, text: comment, date: today() }]
          : r.comments;
        return {
          ...r,
          status: statusMap[decision],
          comments,
          history: [...r.history, { action: actionMap[decision], by: actingRole, date: today() }],
        };
      }),
    );
  };

  const getApproval = (id) => approvals.find((r) => r.id === id);

  return (
    <ApprovalsContext.Provider value={{ approvals, act, getApproval }}>
      {children}
    </ApprovalsContext.Provider>
  );
};

export const useApprovals = () => useContext(ApprovalsContext);
