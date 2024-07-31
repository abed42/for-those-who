import React from "react";
import { TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { useForm, Controller } from "react-hook-form";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import fetchWrapper from "@/utils/fetchWrapper";

type LogInForm = {
  email: string;
  password: string;
};
interface LoginPageProps {
  handleAnimation: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

type LoginResponseType = {
  userId: string;
  token: string;
};

const LoginPage: React.FC<LoginPageProps> = ({
  handleAnimation,
  setIsLoading,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LogInForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [credentialsError, setCredentialsError] =
    React.useState<boolean>(false);

  const getToken = async (data: LogInForm) => {
    try {
      const body = JSON.stringify({
        username: data.email,
        password: data.password,
      });

      const response: LoginResponseType = await fetchWrapper("/users/login", {
        method: "POST",
        body: body,
      });
      handleAnimation();

      await SecureStore.setItemAsync("userId", response.userId);
      await SecureStore.setItemAsync("token", response.token);

      setTimeout(() => {
        router.replace("/(tabs)/feed");
        setIsLoading(false);
      }, 2400);
    } catch (error) {
      if (error instanceof Error && error.message === "401") {
        console.error("An error occurred:", error.message);
        setCredentialsError(true);
      }
    }
  };

  const onSubmit = (data: LogInForm) => {
    getToken(data);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        rules={{ required: "username or email required" }}
        render={({ field }) => (
          <>
            <Text style={styles.label}>Account name or email</Text>
            <TextInput
              {...field}
              onSelectionChange={() => setCredentialsError(false)}
              style={styles.input}
              placeholder="name@forthosewho.com"
              onChangeText={field.onChange}
              aria-label="username or email"
            />
          </>
        )}
      />
      {errors.email && typeof errors.email.message === "string" && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <>
            <Text style={styles.label}>Password</Text>
            <TextInput
              {...field}
              onSelectionChange={() => setCredentialsError(false)}
              style={styles.input}
              placeholder="Password"
              onChangeText={field.onChange}
              secureTextEntry
              aria-label="password"
            />
          </>
        )}
        rules={{ required: "password field required" }}
      />
      {errors.password && typeof errors.password.message === "string" && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}
      {credentialsError && (
        <Text style={styles.errorText}>
          Wrong credentials, please try again!
        </Text>
      )}
      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={() => console.log("i forgot my password")}
      >
        <Text style={{ color: "#0029FF" }}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logInButton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={{ color: "white" }}>LOG IN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    padding: 24,
    marginTop: -40,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 9,
    marginBottom: 10,
    paddingLeft: 10,
    padding: 12,
    marginTop: 12,
  },
  label: {
    fontSize: 16,
  },
  logInButton: {
    borderRadius: 12,
    width: "100%",
    height: 48,
    marginTop: 24,
    backgroundColor: "#0029FF", // Example background color
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotPasswordContainer: {
    display: "flex",
    alignItems: "flex-end",
    marginTop: 12,
  },
  errorText: {
    color: "#F9325D",
    marginBottom: 10,
  },
});

export default LoginPage;
