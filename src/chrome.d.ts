
// Type definitions for Chrome extension API
declare namespace chrome {
  namespace runtime {
    const onInstalled: {
      addListener: (callback: () => void) => void;
    };
    const onMessage: {
      addListener: (callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void) => void;
    };
    function sendMessage(message: any): void;
  }
  namespace contextMenus {
    function create(properties: {
      id: string;
      title: string;
      contexts: string[];
    }): void;
    const onClicked: {
      addListener: (callback: (info: { menuItemId: string; linkUrl?: string }, tab?: any) => void) => void;
    };
  }
  namespace tabs {
    function query(queryInfo: {
      active: boolean;
      currentWindow: boolean;
    }, callback: (tabs: { url?: string }[]) => void): void;
  }
}
