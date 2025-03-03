<script lang="js">
  import { onMount, onDestroy } from "svelte";
  import Glide from "@glidejs/glide";
  export let images =[]
  let glide;

  onMount(() => {
    // Create a new Glide instance with options
    glide = new Glide(".glide", {
      type: "carousel",
      startAt: 0,
      perView: 3,
    });
    glide.mount();
  });

  onDestroy(() => {
    // Clean up the Glide instance
    glide.destroy();
  });
</script>

<!-- Markup for the carousel -->
<div class="glide">
  <div class="glide__track" data-glide-el="track">
    <ul class="glide__slides">
      {#each images as image}
      <li class="glide__slide">
        <img src={image} alt="" >
      </li>
      {/each}
     
      <!-- Add more slides as needed -->
    </ul>
  </div>
</div>

<style>
  /* Import Glide's core and theme CSS */
  @import "@glidejs/glide/dist/css/glide.core.min.css";

</style>
