<script lang="ts">
  import { user } from '$lib/stores/user';

  const logout = () => {
    user.set(null);
    localStorage.removeItem('token');
    location.href = '/';
  };
</script>

<button type="button" on:click={logout}>Logout</button>