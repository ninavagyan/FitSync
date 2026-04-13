package com.clubflow.app.data.remote.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class TrainingDto(
    val id: String,
    val name: String,
    val description: String,
    val category: String,
    @SerialName("startAt") val startAt: String,
    @SerialName("endAt") val endAt: String,
    val capacity: Int,
    @SerialName("bookedCount") val bookedCount: Int,
    @SerialName("trainerName") val trainerName: String,
    @SerialName("isUserBooked") val isUserBooked: Boolean = false,
    val status: String,
)

@Serializable
data class TrainingsEnvelopeDto(
    val items: List<TrainingDto>,
)
