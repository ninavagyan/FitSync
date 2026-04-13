package com.clubflow.app.domain.model

enum class BookingStatus {
    ACTIVE,
    CANCELLED,
    ATTENDED,
    MISSED,
}

data class Booking(
    val id: String,
    val trainingId: String,
    val userId: String,
    val status: BookingStatus,
)
