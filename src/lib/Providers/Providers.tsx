"use client";

// Required for antd v5 static methods (message, Modal.confirm, …) on React 19
import "@ant-design/v5-patch-for-react-19";
import mainTheme from "@/themes/mainTheme";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Provider } from "react-redux";
import { store } from "@/app/store";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AntdRegistry>
        <ConfigProvider theme={mainTheme}>{children}</ConfigProvider>
      </AntdRegistry>
    </Provider>
  );
};

export default Providers;
