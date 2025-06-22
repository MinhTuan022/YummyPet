package com.example.yummypet.repository;

import com.example.yummypet.entity.ReturnExchange;
import com.example.yummypet.entity.ReturnExchangeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnExchangeItemRepository extends JpaRepository<ReturnExchangeItem, Integer> {
    
    List<ReturnExchangeItem> findByReturnExchange(ReturnExchange returnExchange);
    
    List<ReturnExchangeItem> findByReturnExchangeId(Integer returnExchangeId);
    
    void deleteByReturnExchangeId(Integer returnExchangeId);
}
