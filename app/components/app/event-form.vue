<script setup lang="ts">
import type { EventType } from "#shared/types/event";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPE_LABELS } from "@/lib/events";

export interface EventFormValues {
  type: EventType;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
}

const props = defineProps<{
  initial?: EventFormValues;
  submitLabel: string;
  savingLabel: string;
  saving: boolean;
  error: string | null;
}>();

const emit = defineEmits<(e: "submit", values: EventFormValues) => void>();

const form = reactive<EventFormValues>({
  type: props.initial?.type ?? "dig",
  title: props.initial?.title ?? "",
  description: props.initial?.description ?? "",
  startsAt: props.initial?.startsAt ?? "",
  endsAt: props.initial?.endsAt ?? "",
  location: props.initial?.location ?? "",
});
</script>

<template>
  <form class="space-y-4" @submit.prevent="emit('submit', { ...form })">
    <Field>
      <FieldGroup>
        <FieldLabel>Title</FieldLabel>
        <Input
          v-model="form.title"
          type="text"
          placeholder="e.g. Sunday dig at Black Rocks"
          required
        />
      </FieldGroup>
    </Field>
    <Field>
      <FieldGroup>
        <FieldLabel>Type</FieldLabel>
        <select
          v-model="form.type"
          class="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
        >
          <option v-for="(label, value) in EVENT_TYPE_LABELS" :key="value" :value="value">
            {{ label }}
          </option>
        </select>
      </FieldGroup>
    </Field>
    <Field>
      <FieldGroup>
        <FieldLabel>Starts</FieldLabel>
        <Input v-model="form.startsAt" type="datetime-local" required />
      </FieldGroup>
    </Field>
    <Field>
      <FieldGroup>
        <FieldLabel>Ends (optional)</FieldLabel>
        <Input v-model="form.endsAt" type="datetime-local" />
      </FieldGroup>
    </Field>
    <Field>
      <FieldGroup>
        <FieldLabel>Location</FieldLabel>
        <Input
          v-model="form.location"
          type="text"
          placeholder="e.g. Black Rocks car park"
        />
      </FieldGroup>
    </Field>
    <Field>
      <FieldGroup>
        <FieldLabel>Description</FieldLabel>
        <Textarea
          v-model="form.description"
          placeholder="What's happening, what to bring…"
          rows="4"
        />
      </FieldGroup>
    </Field>
    <div class="flex flex-col gap-2">
      <Button type="submit" :disabled="saving">
        {{ saving ? savingLabel : submitLabel }}
      </Button>
      <p v-if="error" class="text-sm text-destructive" role="alert">
        {{ error }}
      </p>
    </div>
  </form>
</template>
