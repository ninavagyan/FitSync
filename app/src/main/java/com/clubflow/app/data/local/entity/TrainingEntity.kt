package com.clubflow.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "trainings")
data class TrainingEntity(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val category: String,
    val startsAtEpochSeconds: Long,
    val endsAtEpochSeconds: Long,
    val capacity: Int,
    val bookedCount: Int,
    val instructorName: String,
    val status: String,
)
