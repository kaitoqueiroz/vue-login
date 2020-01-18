<template>
  <form
    class="form-signin text-left bg-white rounded shadow-sm"
    @submit="login"
  >
    <h1 class="h3 mb-3 font-weight-normal">
      {{ 'Sign in' }}
    </h1>

    <div class="form-group">
      <label for="username">
        {{ 'Username' }}
      </label>
      <input
        type="text"
        id="username"
        v-model="username"
        class="form-control"
        v-bind:class="{
          'is-invalid': usernameErrorMessage && !validUsername,
          'is-valid': validUsername,
        }"
        placeholder="Username"
        autofocus
        v-on:input="validateUser"
      >
      <small v-if="!validUsername" class="form-text text-danger">
        {{ usernameErrorMessage }}
      </small>
    </div>

    <div class="form-group">
      <label for="password">
        {{ 'Password' }}
      </label>

      <input
        type="password"
        id="password"
        v-model="password"
        class="form-control"
        placeholder="Password"
        v-bind:class="{
          'is-invalid': passwordErrorMessage && !validPassword,
          'is-valid': validPassword,
        }"
        v-on:input="validatePassword"
      >
      <small v-if="!validPassword" class="form-text text-danger">
        {{ passwordErrorMessage }}
      </small>
    </div>

    <button
      class="btn btn-lg btn-primary btn-block text-white"
      type="submit"
      v-bind:disabled="invalidForm"
    >
      <div class="spinner-border text-light" role="status" v-if="processingLogin">
        <span class="sr-only">Loading...</span>
      </div>
      <span v-if="!processingLogin">
        {{ 'Sign in' }}
      </span>
    </button>
    <div
      class="mt-2 alert alert-danger"
      role="alert"
      v-if="authError"
    >
      {{ authError }}
    </div>
    <div
      class="mt-2 alert alert-success"
      role="alert"
      v-if="loginSuccessful"
    >
      {{ 'Successfully Authenticated!' }}
    </div>
  </form>
</template>

<style scoped src="@/assets/scss/login.scss" lang="scss"></style>

<script>
import AuthService from '@/services/AuthService';

export default {
  name: 'Login',
  data: () => ({
    username: null,
    password: null,
    authError: null,
    validUsername: false,
    validPassword: false,
    usernameErrorMessage: null,
    passwordErrorMessage: null,
    loginSuccessful: false,
    processingLogin: false,
  }),
  methods: {
    validateUser() {
      this.loginSuccessful = false;
      this.authError = null;
      this.validUsername = false;
      this.usernameErrorMessage = null;

      if (this.timeoutUsernameDebounce) clearTimeout(this.timeoutUsernameDebounce);

      this.timeoutUsernameDebounce = setTimeout(async () => {
        try {
          await AuthService.validate(this.username);
          this.validUsername = true;
        } catch (error) {
          this.usernameErrorMessage = error.message;
        }
      }, 500);
    },
    validatePassword() {
      this.loginSuccessful = false;
      this.authError = null;
      this.validPassword = false;
      this.passwordErrorMessage = null;

      if (this.timeoutPasswordDebounce) clearTimeout(this.timeoutPasswordDebounce);

      this.timeoutPasswordDebounce = setTimeout(() => {
        if (!this.password) {
          this.passwordErrorMessage = "Password can't be empty";
          return;
        }
        if (this.password.length <= 8) {
          this.passwordErrorMessage = 'Password must be longer than 8 letters';
          return;
        }
        if (!/.*[0-9].*/.test(this.password)) {
          this.passwordErrorMessage = 'Password must have at least one number';
          return;
        }

        this.validPassword = true;
      }, 500);
    },
    async login(event) {
      event.preventDefault();

      this.processingLogin = true;
      this.loginSuccessful = false;
      this.authError = null;

      try {
        await AuthService.submit({
          username: this.username,
          password: this.password,
        });
        this.loginSuccessful = true;
      } catch (error) {
        this.authError = error.message;
      }
      this.processingLogin = false;
    },
  },
  computed: {
    invalidForm() {
      return (
        !this.validUsername || !this.validPassword
      );
    },
  },
};
</script>
