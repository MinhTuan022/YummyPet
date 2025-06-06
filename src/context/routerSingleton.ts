import { NavigateFunction } from "react-router-dom";

class RouterSingleton {
  private static instance: RouterSingleton;
  private navigate: NavigateFunction | null = null;

  private constructor() {}

  public static getInstance(): RouterSingleton {
    if (!RouterSingleton.instance) {
      RouterSingleton.instance = new RouterSingleton();
    }
    return RouterSingleton.instance;
  }

  // Khởi tạo hàm navigate
  public setNavigate(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  // Điều hướng tới trang Cart và truyền dữ liệu bằng state
  public openCart(id: number, name: string, age: number) {
    this.navigateTo(`/cart/${id}`, { state: { name, age } });
  }

  // Điều hướng tới trang Product Detail và truyền dữ liệu bằng state
  public openProductDetail(id: string, extraData?: any) {
    this.navigateTo(`/product/${id}`, { state: extraData });
  }

  // Điều hướng tới trang Login
  public openLogin() {
    this.navigateTo("/login");
  }

  public openAny(path: string) {
    this.navigateTo(path);
  }

  // Hàm điều hướng chung
  private navigateTo(path: string, options?: { state?: any }) {
    if (this.navigate) {
      this.navigate(path, options);
    } else {
      console.error("Navigate function is not initialized");
    }
  }
}

export const _router = RouterSingleton.getInstance();
