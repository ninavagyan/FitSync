package com.clubflow.app.di

import android.content.Context
import android.content.SharedPreferences
import androidx.room.Room
import com.clubflow.app.BuildConfig
import com.clubflow.app.data.local.ClubFlowDatabase
import com.clubflow.app.data.remote.ClubFlowApi
import com.clubflow.app.data.remote.KtorClubFlowApi
import com.clubflow.app.data.repository.ApiAuthRepository
import com.clubflow.app.data.repository.ApiTrainingRepository
import com.clubflow.app.domain.repository.AuthRepository
import com.clubflow.app.domain.repository.TrainingRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.client.request.header
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.serialization.kotlinx.json.json
import javax.inject.Singleton
import kotlinx.serialization.json.Json

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideHttpClient(): HttpClient {
        return HttpClient(OkHttp) {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                })
            }
            defaultRequest {
                header(HttpHeaders.ContentType, ContentType.Application.Json)
                header(HttpHeaders.Accept, ContentType.Application.Json)
            }
        }
    }

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): ClubFlowDatabase {
        return Room.databaseBuilder(
            context,
            ClubFlowDatabase::class.java,
            "clubflow.db",
        ).build()
    }

    @Provides
    @Singleton
    fun providePreferences(@ApplicationContext context: Context): SharedPreferences {
        return context.getSharedPreferences("clubflow_prefs", Context.MODE_PRIVATE)
    }

    @Provides
    @Singleton
    fun provideClubFlowApi(
        httpClient: HttpClient,
        baseUrl: String,
    ): ClubFlowApi = KtorClubFlowApi(httpClient = httpClient, baseUrl = baseUrl)

    @Provides
    @Singleton
    fun provideAuthRepository(repository: ApiAuthRepository): AuthRepository = repository

    @Provides
    @Singleton
    fun provideTrainingRepository(repository: ApiTrainingRepository): TrainingRepository = repository

    @Provides
    fun provideBaseUrl(): String = BuildConfig.BASE_URL
}
