<script setup>
defineProps({
  classrooms: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 },
})
</script>

<template>
  <div class="row">
    <ul class="list-group">
      <li
        class="list-group-item px-3"
        v-for="(classroom, index) in classrooms"
        :class="{ active: index == selectedIndex }"
        :key="classroom.cid"
      >
        <div class="card" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">{{ classroom.c_name }}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
            <p class="card-text">
              Some quick example text to build on the card title and make up the bulk of the card’s
              content.
            </p>
            <a href="#" class="card-link">Card link</a>
            <a href="#" class="card-link">Another link</a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
