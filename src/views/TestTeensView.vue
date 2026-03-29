<script setup lang="ts">
import QuizRunner from '../components/QuizRunner.vue'
import { teensIntro, teensQuestions } from '../data/questionsTeens'
</script>

<template>
  <QuizRunner
    variant="teens"
    title="Тест для подростков"
    :intro="teensIntro"
    :questions="teensQuestions"
  />
</template>
