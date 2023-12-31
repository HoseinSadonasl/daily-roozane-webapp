import { useContext, useEffect, useState } from "react";
import DailyLogo from "../src/assets/daily-logo.svg";
import styles from "./SignUp.module.css";
import { AppContext } from "../src/AppContext";
import { useForm } from "react-hook-form";
import useAxiosFunction from "../src/hooks/useAxiosFunction";

const Registration = () => {
  const [signup, setSignup] = useState(false);
  const [user, setUser] = useState({});
  const [registerText, setRegisterText] = useState({
    span: "حسابی ندارید؟",
    a: "ثبت نام کنید",
    submitText: "ورود",
  });

  const [response, , , fetchData] = useAxiosFunction();

  const { setLoggedIn } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  function handleReqistrationType() {
    setSignup(!signup);
  }

  useEffect(() => {
    if (response) {
      switch (response.status) {
        case 200: {
          handleSuccessLogin(response.data);
          break;
        }
        case 201: {
          handleUserSuccessRegisteration(response.data);
          break;
        }
        case 400: {
          // todo: handleError
          break;
        }
        case 404: {
          // todo: handleError
          break;
        }
        case 409: {
          // todo: handleError
          break;
        }
        case 500: {
          // todo: handleError
          break;
        }

        default:
          break;
      }
    }
    handleRegistrationText();
  }, [signup, response]);

  function handleSuccessLogin(res) {
    if (res) {
      localStorage.setItem("token", res.token);
      setLoggedIn(true);
    }
  }
  function handleUserSuccessRegisteration(res) {
    if (res) {
      localStorage.setItem("user", res.user);
      setSignup(false);
      setUser(res.user);
    }
  }

  function handleRegistrationText() {
    if (signup) {
      setRegisterText({
        span: "قبلا ثبت نام کرده اید؟",
        a: "وارد شوید",
        submitText: "ثبت نام",
      });
    } else {
      setRegisterText({
        span: "حسابی ندارید؟",
        a: "ثبت نام کنید",
        submitText: "ورود",
      });
    }
  }

  function registerUser(params) {
    const user = {
      username: params.username,
      email: params.email,
      password: params.password,
    };

    fetchData({
      method: "post",
      url: `auth/${signup ? "register" : "login"}`,
      data: user,
    });
  }

  function handleForm() {
    if (signup) {
      return (
        <>
          <label htmlFor="username">نام کاربری</label>{" "}
          {errors.username && (
            <span className={styles.error}>نام کاربری را وارد کنید</span>
          )}
          <input
            type="text"
            id="username"
            placeholder="حسین اصل"
            {...register("username", { minLength: 3 })}
          />
          <label htmlFor="email">ایمیل</label>{" "}
          {errors.email && (
            <span className={styles.error}>ایمیل خود را وارد کنید</span>
          )}
          <input
            type="email"
            id="email"
            placeholder="example@example.com"
            {...register("email", { required: true })}
          />
          <label htmlFor="password">گذرواژه </label>{" "}
          {errors.password && (
            <span className={styles.error}>گذرواژه خود را وارد کنید</span>
          )}
          <input
            type="password"
            id="password"
            {...register("password", { required: true, minLength: 8 })}
          />
          <label htmlFor="confirmPassword">تکرار گذرواژه</label>{" "}
          {getValues("password") !== getValues("confirmPassword") && (
            <span className={styles.error}>گذرواژه ها نباید متفاوت باشند</span>
          )}
          <input
            type="password"
            placeholder="حداقل 8 کاراکتر باشد"
            id="confirmPassword"
            {...register("confirmPassword", { required: true, minLength: 8 })}
          />
        </>
      );
    } else {
      return (
        <>
          <label htmlFor="email">ایمیل</label>
          {errors.email && (
            <span className={styles.error}>ایمیل خود را وارد کنید</span>
          )}
          <input
            type="email"
            id="email"
            placeholder="حسین اصل"
            value={user && user?.email}
            {...register("email", { required: true })}
          />
          <label htmlFor="password">گذرواژه </label>{" "}
          {errors.password && (
            <span className={styles.error}>گذرواژه خود را وارد کنید</span>
          )}
          <input
            type="password"
            id="password"
            placeholder="example@example.com"
            value={user && user.password}
            {...register("password", { required: true, minLength: 8 })}
          />
        </>
      );
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <img className={styles.logo} src={DailyLogo} />
        <form onSubmit={handleSubmit(registerUser)} action="submit">
          {handleForm()}
          <button type="submit" className={styles.btn}>
            {registerText.submitText}
          </button>
        </form>
        <span className={styles.text}>
          {registerText.span}
          <a onClick={handleReqistrationType}>{registerText.a}</a>
        </span>
      </div>
    </div>
  );
};

export default Registration;
