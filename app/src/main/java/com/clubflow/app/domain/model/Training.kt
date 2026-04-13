package com.clubflow.app.domain.model

import kotlinx.datetime.Instant

enum class TrainingCategory {
    PILATES,
    YOGA,
    GROUP_TRAINING,
}

enum class TrainingStatus {
    SCHEDULED,
    FULL,
    CANCELLED,
    EXPIRED,
}

data class Training(
    val id: String,
    val name: String,
    val description: String,
    val category: TrainingCategory,
    val startsAt: Instant,
    val endsAt: Instant,
    val capacity: Int,
    val bookedCount: Int,
    val isUserBooked: Boolean,
    val instructorName: String,
    val status: TrainingStatus,
) {
    val availableSeats: Int = (capacity - bookedCount).coerceAtLeast(0)
    val isBookable: Boolean = status == TrainingStatus.SCHEDULED && availableSeats > 0 && !isUserBooked
    val canCancel: Boolean = status != TrainingStatus.CANCELLED && status != TrainingStatus.EXPIRED && isUserBooked
}
