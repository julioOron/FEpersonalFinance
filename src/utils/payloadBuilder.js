export function buildPayloadForModule(moduleKey, formData, sessionData = {}) {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  
    switch (moduleKey) {
      case "bank-accounts":
        const { bat_ID, ...rest } = formData;
        return {
          ...rest,
          bat_UserID: sessionData.userId,
          bat_CreatedAt: now,
          bat_UpdatedAt: now,
        };
  
      case "balances":
        return {
          ...formData,
          blc_UserID: sessionData.userId,
          blc_CreatedAt: now,
          blc_UpdatedAt: now,
        };
      case "incomes":
        const { inc_ID, ...restIncome } = formData;
        return {
          ...restIncome,
          inc_UserID: sessionData.userId,
          inc_CreatedAt: now,
          inc_UpdatedAt: now,
        };
  
      case "outgoins":
        const { otg_ID, ...restOutgoing } = formData;
        return {
          ...restOutgoing,
          otg_UserID: sessionData.userId,
          otg_CreatedAt: now,
          otg_UpdatedAt: now,
        };
      case "transfers":
        const { trf_ID, ...restTransfer} = formData;
        return {
          ...restTransfer,
          trf_UserID: sessionData.userId,
          trf_CreatedAt: now,
        };
  
      
  
      default:
        return formData;
    }
  }
  