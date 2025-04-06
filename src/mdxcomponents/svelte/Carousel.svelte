<script lang="js">
  import { onMount, onDestroy } from "svelte";
  import Glide from "@glidejs/glide";
  export let images =[]
  let glide;

  onMount(() => {
    // Create a new Glide instance with options
    glide = new Glide(".glide", {
      type: "slider",
      startAt: 0,
      focusAt: 'center',
      perView: 3,

      autoplay:5000,
      hoverpause:true
     
    });
    glide.mount();
  });

  onDestroy(() => {
    // Clean up the Glide instance
    glide.destroy();
  });
</script>

<!-- Markup for the carousel -->
<div class="glide container">
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

  .container {
    margin-top: 125px;
    cursor: grab;
  }
</style>
