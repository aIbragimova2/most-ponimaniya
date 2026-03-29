<script setup lang="ts">
import QuizRunner from '../components/QuizRunner.vue'
import { parentsIntro, parentsQuestions } from '../data/questionsParents'
</script>

<template>
  <QuizRunner
    variant="parents"
    title="Тест для родителей"
    :intro="parentsIntro"
    :questions="parentsQuestions"
  />
</template>
