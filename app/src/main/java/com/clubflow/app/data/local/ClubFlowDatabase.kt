package com.clubflow.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.clubflow.app.data.local.dao.TrainingDao
import com.clubflow.app.data.local.entity.TrainingEntity

@Database(
    entities = [TrainingEntity::class],
    version = 1,
    exportSchema = false,
)
abstract class ClubFlowDatabase : RoomDatabase() {
    abstract fun trainingDao(): TrainingDao
}
