package com.clubflow.app.domain.repository

import com.clubflow.app.domain.model.Training
import kotlinx.coroutines.flow.Flow

interface TrainingRepository {
    fun observeUpcomingTrainings(): Flow<List<Training>>
    suspend fun refreshTrainings()
    suspend fun bookTraining(trainingId: String): Result<Unit>
    suspend fun cancelBooking(trainingId: String): Result<Unit>
}
