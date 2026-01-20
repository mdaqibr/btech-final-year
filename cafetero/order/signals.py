# order/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from order.models import OrderFeedback
from menu.models import FoodRating

@receiver(post_save, sender=OrderFeedback)
def update_food_rating(sender, instance, **kwargs):
    for item in instance.order.items.all():
        food = item.daily_menu_item.floor_food.vendor_branch_food

        rating, _ = FoodRating.objects.get_or_create(food=food)

        total = rating.total_ratings
        rating.avg_rating = (
            (rating.avg_rating * total + instance.rating)
            / (total + 1)
        )
        rating.total_ratings += 1
        rating.save()
